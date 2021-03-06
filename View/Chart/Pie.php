<?php

namespace Lightning\View\Chart;

use Lightning\Tools\Request;
use Lightning\View\Field\BasicHTML;
use Lightning\View\JS;

class Pie extends Base {
    protected $renderer = 'Pie';

    public function __construct($id = null, $settings = array()) {
        // Import the settings.
        if ($id) {
            $this->id = $id;
        }
        foreach ($settings as $key => $value) {
            $this->$key = $value;
        }

        // Construct the parent.
        parent::__construct();
    }

    public function renderControls() {
        return BasicHTML::select('start', [
            -7 => 'Last 7 Days',
            -30 => 'Last 30 Days',
            -60 => 'Last 60 Days',
            -90 => 'Last 90 Days',
        ]);
    }
}
