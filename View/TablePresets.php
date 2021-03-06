<?php

namespace Lightning\View;

class TablePresets {
    public static function userSearch() {
        return array(
            'autocomplete' => array(
                'table' => 'user',
                'field' => 'user_id',
                'search' => array('email', 'first', 'last'),
                'display_value' => function(&$row) {
                    $row = $row['first'] . ' ' . $row['last'] . '(' . $row['email'] . ')';
                }
            ),
        );
    }
}
