<?php
// File: includes/class-hrsc-support-case-cpt.php

defined('ABSPATH') || exit;

class HRSC_Support_Case_CPT
{

    public static function register_post_type()
    {
        $labels = [
            'name' => __('Support Cases', 'hr-support-chat'),
            'singular_name' => __('Support Case', 'hr-support-chat'),
            'add_new' => __('Add New Case', 'hr-support-chat'),
            'add_new_item' => __('Add New Support Case', 'hr-support-chat'),
            'edit_item' => __('Edit Support Case', 'hr-support-chat'),
            'new_item' => __('New Support Case', 'hr-support-chat'),
            'view_item' => __('View Support Case', 'hr-support-chat'),
            'search_items' => __('Search Support Cases', 'hr-support-chat'),
            'not_found' => __('No support cases found.', 'hr-support-chat'),
            'not_found_in_trash' => __('No support cases in trash.', 'hr-support-chat'),
        ];

        $args = [
            'labels' => $labels,
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'capability_type' => 'post',
            'capabilities' => [
                'edit_post' => 'edit_support_case',
                'read_post' => 'read_support_case',
                'delete_post' => 'delete_support_case',
                'edit_posts' => 'edit_support_cases',
                'edit_others_posts' => 'edit_others_support_cases',
                'publish_posts' => 'publish_support_cases',
                'read_private_posts' => 'read_private_support_cases',
            ],
            'map_meta_cap' => true,
            'supports' => ['title', 'editor', 'comments'],
            'has_archive' => false,
            'show_in_rest' => true,
        ];

        register_post_type('support_case', $args);
    }
}
