<?php
// File: includes/class-hrsc-rest-api.php

defined('ABSPATH') || exit;

class HRSC_REST_API
{

    public static function register_routes()
    {
        register_rest_route('hrsc/v1', 'support-cases', [
            'methods' => 'GET',
            'callback' => [self::class, 'get_support_cases'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('hrsc/v1', 'support-cases', [
            'methods' => 'POST',
            'callback' => [self::class, 'create_support_case'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('hrsc/v1', 'support-cases/(?P<id>\d+)/messages', [
            'methods' => 'GET',
            'callback' => [self::class, 'get_case_messages'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('hrsc/v1', 'support-cases/(?P<id>\d+)/messages', [
            'methods' => 'POST',
            'callback' => [self::class, 'post_case_message'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('hrsc/v1', 'support-cases/(?P<id>\d+)', [
            'methods' => 'PATCH',
            'callback' => [self::class, 'patch_support_case'],
            'permission_callback' => function () {
                return current_user_can('edit_support_cases');
            },
        ]);

        register_rest_route('hrsc/v1', '/support-cases/(?P<id>\d+)/upload', [
            'methods' => 'POST',
            'callback' => [self::class, 'hrsc_handle_file_upload'],
            'permission_callback' => '__return_true'
        ]);

        register_rest_route('hrsc/v1', '/support-cases/(?P<id>\d+)/attachments', [
            'methods' => 'GET',
            'callback' => [self::class, 'get_attachments'],
            'args' => [
                'id' => [
                    'required' => true,
                    'type' => 'integer',
                ],
            ],
            'permission_callback' => '__return_true', // ⚠ adjust this later
        ]);

    }

    // --------------------------
    // Auth + Rate Limit
    // --------------------------

    private static function validate_token($post_id)
    {
        // 1. Check $_POST first (form submissions or file uploads)
        $token = isset($_POST['token']) ? sanitize_text_field($_POST['token']) : null;
        $email = isset($_POST['email']) ? sanitize_email($_POST['email']) : null;
        $first_name = isset($_POST['first_name']) ? sanitize_text_field($_POST['first_name']) : null;

        // 2. Fallback: JSON body (used in fetch calls with body)
        if (!$token && !$email && !$first_name) {
            $body = json_decode(file_get_contents('php://input'), true);
            if (is_array($body)) {
                $token = sanitize_text_field($body['token'] ?? '');
                $email = sanitize_email($body['email'] ?? '');
                $first_name = sanitize_text_field($body['first_name'] ?? '');
            }
        }

        // ✅ 3. Fallback: GET parameters (used in GET requests)
        if (!$token && !$email && !$first_name) {
            $token = isset($_GET['token']) ? sanitize_text_field($_GET['token']) : null;
            $email = isset($_GET['email']) ? sanitize_email($_GET['email']) : null;
            $first_name = isset($_GET['first_name']) ? sanitize_text_field($_GET['first_name']) : null;
        }

        // Validate against stored post meta
        $stored_token = get_post_meta($post_id, '_hrsc_token', true);
        $stored_email = get_post_meta($post_id, '_hrsc_employee_email', true);
        $stored_first_name = get_post_meta($post_id, '_hrsc_employee_first_name', true);

        if ($token && hash_equals($stored_token, $token)) {
            return true;
        }

        if ($email && $first_name && $email === $stored_email && $first_name === $stored_first_name) {
            return true;
        }

        return false;
    }



    private static function rate_limit_check($token)
    {
        $key = 'hrsc_rate_' . md5($token);
        $count = (int) get_transient($key);
        $limit = (int) (get_option('hrsc_settings')['rate_limit'] ?? 5);

        if ($count >= $limit) {
            return false;
        }

        set_transient($key, $count + 1, MINUTE_IN_SECONDS);
        return true;
    }

    // --------------------------
    // REST Endpoints
    // --------------------------

    public static function get_support_cases($request)
    {
        if (is_user_logged_in() && current_user_can('edit_support_cases')) {
            $query = new WP_Query([
                'post_type' => 'support_case',
                'posts_per_page' => -1,
                'orderby' => 'date',
                'order' => 'DESC',
            ]);
        } else {
            $token = sanitize_text_field($request->get_param('token'));
            $email = sanitize_email($request->get_param('email'));
            $first_name = sanitize_text_field($request->get_param('first_name'));

            if (!$token && (!$email || !$first_name)) {
                return new WP_Error('unauthorized', __('Unauthorized', 'hr-support-chat'), ['status' => 401]);
            }

            $meta_query = ['relation' => 'OR'];

            if ($token) {
                $meta_query[] = ['key' => '_hrsc_token', 'value' => $token];
            }

            if ($email && $first_name) {
                $meta_query[] = [
                    'relation' => 'AND',
                    ['key' => '_hrsc_employee_email', 'value' => $email],
                    ['key' => '_hrsc_employee_first_name', 'value' => $first_name],
                ];
            }

            $query = new WP_Query([
                'post_type' => 'support_case',
                'posts_per_page' => -1,
                'meta_query' => $meta_query,
                'orderby' => 'date',
                'order' => 'DESC',
            ]);
        }

        $cases = [];

        foreach ($query->posts as $case) {
            $cases[] = [
                'id' => $case->ID,
                'title' => get_the_title($case),
                'status' => get_post_meta($case->ID, '_hrsc_status', true),
                'date' => $case->post_date,
            ];
        }

        return $cases;
    }

    public static function get_case_messages($request)
    {
        $post_id = (int) $request['id'];
        if (!get_post($post_id))
            return new WP_Error('not_found', __('Case not found.', 'hr-support-chat'), ['status' => 404]);

        $user_is_logged_in = is_user_logged_in();
        $token_is_valid = self::validate_token($post_id);

        if (!$user_is_logged_in && !$token_is_valid) {
            return new WP_Error(
                'unauthorized',
                __('Unauthorized', 'hr-support-chat'),
                ['status' => 401]
            );
        }

        $comments = get_comments([
            'post_id' => $post_id,
            'orderby' => 'comment_date',
            'order' => 'ASC',
            'status' => 'approve',
            'type__in' => ['comment', 'hrsc_system', 'hrsc_attachment']
        ]);

        $messages = [];
        foreach ($comments as $comment) {
            $is_system = $comment->comment_type === 'hrsc_system';
            $messages[] = [
                'author' => $comment->comment_author,
                'content' => wp_kses_post($comment->comment_content),
                'date' => $comment->comment_date,
                'is_hr' => $is_system ? false : user_can($comment->user_id, 'edit_support_cases'),
                'is_system' => $is_system,
            ];
        }
        return $messages;
    }

    public static function post_case_message($request)
    {
        $post_id = (int) $request['id'];

        if (!get_post($post_id)) {
            return new WP_Error('not_found', __('Case not found.', 'hr-support-chat'), ['status' => 404]);
        }

        // Honeypot check
        $settings = get_option('hrsc_settings');
        $honeypot = sanitize_text_field($request->get_param($settings['honeypot_field'] ?? 'website'));
        if (!empty($honeypot)) {
            return new WP_Error('spam_detected', __('Spam detected.', 'hr-support-chat'), ['status' => 403]);
        }

        // 🔐 Authorization
        if (is_user_logged_in()) {
            if (!current_user_can('edit_support_cases')) {
                return new WP_Error('unauthorized', 'HR advisor unauthorized.', ['status' => 403]);
            }
        } else {
            if (!self::validate_token($post_id)) {
                return new WP_Error('unauthorized', 'Invalid token or session.', ['status' => 401]);
            }
        }

        // 🧠 Rate limiting — only for token-based users
        $token = sanitize_text_field($request->get_param('token'));
        if (!is_user_logged_in() && $token && !self::rate_limit_check($token)) {
            return new WP_Error('rate_limited', __('Too many messages, slow down.', 'hr-support-chat'), ['status' => 429]);
        }

        $content = sanitize_textarea_field($request->get_param('message'));

        wp_insert_comment([
            'comment_post_ID' => $post_id,
            'comment_content' => $content,
            'user_id' => get_current_user_id(),
            'comment_approved' => 1,
        ]);

        // 👥 Auto-assign and update status if HR/Admin
        if (is_user_logged_in() && current_user_can('edit_support_cases')) {
            update_post_meta($post_id, '_hrsc_status', 'Ongoing');
            update_post_meta($post_id, '_hrsc_assigned_hr', get_current_user_id());
        }

        return ['success' => true];
    }


    public static function patch_support_case($request)
    {
        $post_id = (int) $request['id'];

        $status = sanitize_text_field($request->get_param('status'));
        $assigned_hr = intval($request->get_param('assigned_hr'));

        if (!get_post($post_id)) {
            return new WP_Error('not_found', __('Case not found.', 'hr-support-chat'), ['status' => 404]);
        }

        update_post_meta($post_id, '_hrsc_status', $status);
        update_post_meta($post_id, '_hrsc_assigned_hr', $assigned_hr);

        return ['success' => true];
    }

    public static function create_support_case(WP_REST_Request $request)
    {
        $params = $request->get_json_params();
        $anonymous = isset($params['anonymous']) && $params['anonymous'] === true;
        $email = sanitize_email($params['email'] ?? '');
        $first_name = sanitize_text_field($params['first_name'] ?? '');
        $token = sanitize_text_field($params['token'] ?? '');

        if (!$anonymous && (empty($email) || empty($first_name))) {
            return new WP_Error('missing_fields', __('Email and first name are required.', 'hr-support-chat'), ['status' => 400]);
        }

        if ($anonymous && empty($token)) {
            $token = wp_generate_password(12, false, false);
        }

        $post_id = wp_insert_post([
            'post_type' => 'support_case',
            'post_status' => 'publish',
            'post_title' => $anonymous ? __('Anonymous Support Case', 'hr-support-chat') : sprintf(__('Support Case – %s', 'hr-support-chat'), $first_name),
            'post_content' => '',
            'comment_status' => 'open',
        ]);

        if (is_wp_error($post_id)) {
            return new WP_Error('create_failed', __('Failed to create support case.', 'hr-support-chat'), ['status' => 500]);
        }

        update_post_meta($post_id, '_hrsc_status', 'Open');
        update_post_meta($post_id, '_hrsc_token', $anonymous ? $token : '');
        update_post_meta($post_id, '_hrsc_employee_email', $email);
        update_post_meta($post_id, '_hrsc_employee_first_name', $first_name);

        // Add system comment
        wp_insert_comment([
            'comment_post_ID' => $post_id,
            'comment_content' => __('Conversation started', 'hr-support-chat'),
            'comment_author' => 'System',
            'comment_type' => 'hrsc_system',
            'comment_approved' => 1,
        ]);

        if (empty(get_post_meta($post_id, '_hrsc_assigned_hr', true))) {
            do_action('hrsc_support_case_created_unassigned', $post_id);
        }

        return [
            'success' => true,
            'post_id' => $post_id,
            'token' => $anonymous ? $token : null,
        ];
    }

    public static function hrsc_handle_file_upload($request)
    {
        $post_id = $request['id'];

        if (!get_post($post_id)) {
            return new WP_Error('not_found', __('Support case not found.', 'hr-support-chat'), ['status' => 404]);
        }

        if (empty($_FILES['file'])) {
            return new WP_Error('no_file', __('No file provided.', 'hr-support-chat'), ['status' => 400]);
        }

        // AUTH: Logged-in or token/email
        if (is_user_logged_in()) {
            if (!current_user_can('upload_files')) {
                return new WP_Error('unauthorized', __('Logged-in user not allowed to upload file.', 'hr-support-chat'), ['status' => 403]);
            }
        } else {
            if (!self::validate_token($post_id)) {
                return new WP_Error('unauthorized', __('Invalid token or session.', 'hr-support-chat'), ['status' => 401]);
            }
        }

        // Parse token/email from request body (JSON or POST)
        $token = $_POST['token'] ?? '';
        $email = $_POST['email'] ?? '';
        $first_name = $_POST['first_name'] ?? '';

        if (empty($email) || empty($first_name)) {
            $body = json_decode(file_get_contents('php://input'), true);
            $email = $body['email'] ?? '';
            $first_name = $body['first_name'] ?? '';
        }

        $email = sanitize_email($email);
        $first_name = sanitize_text_field($first_name);

        $file = $_FILES['file'];

        require_once ABSPATH . 'wp-admin/includes/file.php';
        $upload = wp_handle_upload($file, ['test_form' => false]);

        if (isset($upload['error'])) {
            return new WP_Error('upload_error', $upload['error'], ['status' => 500]);
        }

        // Create attachment post
        $attachment = [
            'post_mime_type' => $upload['type'],
            'post_title' => sanitize_file_name($file['name']),
            'post_content' => '',
            'post_status' => 'inherit',
        ];

        $attach_id = wp_insert_attachment($attachment, $upload['file'], $post_id);
        require_once ABSPATH . 'wp-admin/includes/image.php';
        $attach_data = wp_generate_attachment_metadata($attach_id, $upload['file']);
        wp_update_attachment_metadata($attach_id, $attach_data);

        // 📎 Create a chat comment with the file link
        $comment_content = sprintf(
            __('📎 Uploaded file: <br><a class="uploaded-file" href="%s" target="_blank" rel="noopener noreferrer"><img src="%s" alt="%s"></a>', 'hr-support-chat'),
            esc_url(wp_get_attachment_url($attach_id)),
            esc_url(wp_get_attachment_image_src($attach_id, 'large')[0]),
            esc_html(basename($file['name']))
        );

        $commentdata = [
            'comment_post_ID' => $post_id,
            'comment_content' => $comment_content,
            'comment_type' => 'hrsc_attachment',
            'comment_approved' => 1,
            'comment_author' => $first_name ?: 'Anonymous',
            'comment_author_email' => $email,
            'comment_author_url' => '',
            'comment_agent' => 'hrsc-uploader',
        ];

        wp_insert_comment($commentdata);

        return [
            'success' => true,
            'attachment_id' => $attach_id,
            'url' => wp_get_attachment_url($attach_id),
        ];
    }


    public static function get_attachments($request)
    {
        $parent_id = $request['id'];

        $attachments = get_children([
            'post_parent' => $parent_id,
            'post_type' => 'attachment',
            'post_status' => 'inherit',
            'posts_per_page' => -1,
        ]);

        $response = [];

        foreach ($attachments as $attachment) {
            $response[] = [
                'id' => $attachment->ID,
                'title' => get_the_title($attachment->ID),
                'source_url' => wp_get_attachment_url($attachment->ID),
                'thumbnail_url' => wp_get_attachment_image_src($attachment->ID, 'medium')[0]
            ];
        }

        return rest_ensure_response($response);
    }
}