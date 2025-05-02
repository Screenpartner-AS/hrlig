<?php
// File: includes/class-hrsc-meta-boxes.php

defined('ABSPATH') || exit;

class HRSC_Meta_Boxes
{

    public static function register_meta_boxes()
    {
        add_meta_box(
            'hrsc_support_case_details',
            __('Support Case Details', 'hr-support-chat'),
            [self::class, 'render_meta_box'],
            'support_case',
            'side',
            'default'
        );

        add_meta_box(
            'hrsc_chat_interface',
            __('Chat Interface', 'hr-support-chat'),
            [__CLASS__, 'render_chat_button'],
            'support_case',
            'side',
            'high'
        );
    }

    public static function render_meta_box($post)
    {
        wp_nonce_field('hrsc_save_meta', 'hrsc_meta_nonce');

        $status = get_post_meta($post->ID, '_hrsc_status', true);
        $assigned = get_post_meta($post->ID, '_hrsc_assigned_hr', true);
        $email = get_post_meta($post->ID, '_hrsc_employee_email', true);
        $first_name = get_post_meta($post->ID, '_hrsc_employee_first_name', true);

        $users = get_users(['role' => 'hr_advisor']);

        ?>
        <p><strong><?php _e('Status', 'hr-support-chat'); ?></strong></p>
        <select name="hrsc_status">
            <?php foreach (['New', 'Ongoing', 'Closed'] as $option): ?>
                <option value="<?php echo esc_attr($option); ?>" <?php selected($status, $option); ?>>
                    <?php echo esc_html($option); ?>
                </option>
            <?php endforeach; ?>
        </select>

        <p><strong><?php _e('Assigned HR Advisor', 'hr-support-chat'); ?></strong></p>
        <select name="hrsc_assigned_hr">
            <option value=""><?php _e('Unassigned', 'hr-support-chat'); ?></option>
            <?php foreach ($users as $user): ?>
                <option value="<?php echo esc_attr($user->ID); ?>" <?php selected($assigned, $user->ID); ?>>
                    <?php echo esc_html($user->display_name); ?>
                </option>
            <?php endforeach; ?>
        </select>

        <p><strong><?php _e('Employee Email', 'hr-support-chat'); ?></strong></p>
        <input type="email" name="hrsc_employee_email" value="<?php echo esc_attr($email); ?>" style="width:100%;">

        <p><strong><?php _e('Employee First Name', 'hr-support-chat'); ?></strong></p>
        <input type="text" name="hrsc_employee_first_name" value="<?php echo esc_attr($first_name); ?>" style="width:100%;">
        <?php
    }

    public static function save_meta_boxes($post_id)
    {
        if (!isset($_POST['hrsc_meta_nonce']) || !wp_verify_nonce($_POST['hrsc_meta_nonce'], 'hrsc_save_meta')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $fields = [
            '_hrsc_status' => sanitize_text_field($_POST['hrsc_status'] ?? ''),
            '_hrsc_assigned_hr' => intval($_POST['hrsc_assigned_hr'] ?? 0),
            '_hrsc_employee_email' => sanitize_email($_POST['hrsc_employee_email'] ?? ''),
            '_hrsc_employee_first_name' => sanitize_text_field($_POST['hrsc_employee_first_name'] ?? ''),
        ];

        foreach ($fields as $key => $value) {
            update_post_meta($post_id, $key, $value);
        }
    }

    public static function render_chat_button($post)
    {
        $url = add_query_arg([
            'case_id' => $post->ID,
            'hr_mode' => 1,
        ], site_url('/chat/'));

        echo '<p><a href="' . esc_url($url) . '" target="_blank" class="button button-primary">';
        esc_html_e('Open Chat Interface', 'hr-support-chat');
        echo '</a></p>';
    }
}
