<?php
/**
 * @file
 * Lightning\Tools\ClientUser
 */

namespace Lightning\Tools;

use Lightning\Model\User;

/**
 * A singleton for the global user.
 *
 * @package Lightning\Tools.
 */
class ClientUser extends Singleton {

    /**
     * Get the currently logged in user.
     *
     * @return User
     *   The currently logged in user.
     */
    public static function getInstance($create = true) {
        return parent::getInstance($create);
    }

    /**
     * Create the default logged in user.
     *
     * @return User
     *   The currently logged in user.
     */
    public static function createInstance() {
        // If a session is found.
        $session = Session::getInstance(true, false);
        if ($session && $session->user_id > 0) {
            // If we are logged into someone elses account.
            if ($impersonate = $session->getSetting('impersonate')) {
                $user = User::loadById($impersonate);
            } else {
                // Try to load the user on this session.
                $user = User::loadById($session->user_id);
            }
        }

        if (!empty($user)) {
            return $user;
        } else {
            // No user was found.
            return User::anonymous();
        }
    }

    /**
     * Require the user to log in and return to this page afterwards.
     *
     * @param string $action
     *   The action on the login page.
     */
    public static function requireLogin($action = '') {
        if (self::getInstance()->id == 0) {
            $query = array();
            if (!empty($action)) {
                $query['action'] = $action;
            }

            // Set the redirect parameter.
            $query['redirect'] = Request::get('request');
            // Add the current query string.
            $redirect_query = $_GET;
            unset($redirect_query['request']);
            if (!empty($redirect_query)) {
                $query['redirect'] .= '?' . http_build_query($redirect_query);
            }
            Navigation::redirect('/user' . $action, $query);
        }
    }

    /**
     * Require to log in if not, and to be an admin or give an access denied page.
     */
    public static function requireAdmin() {
        self::requireLogin();
        if (!self::getInstance()->isAdmin()) {
            Output::accessDenied();
        }
    }
}
