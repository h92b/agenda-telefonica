<?php

namespace assets\forms\Ajax;

/**
 * creado por h92barrios
*/

function valid_email(string $a)
{
    #validar el email;
    return $a;
}

function valid_password(string $a)
{
    #validar el password;
    return $a;
}

(isset($_POST['email'])) ? $email = valid_email($_POST['email']) : $email = null;
(isset($_POST['password'])) ? $password = valid_password($_POST['password']) : $password = null;
(isset($_POST['csrf'])) ? $csrf = $_POST['csrf'] : $csrf = null;

echo $csrf;