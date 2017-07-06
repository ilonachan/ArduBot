<?php
$r = new HttpRequest('localhost/request.php', HttpRequest::METH_GET);
$r->setOptions(array('lastmodified' => filemtime('local.rss')));
$r->addQueryData($_GET);
try {
    $r->send();
    if ($r->getResponseCode() == 200) {
        echo $r->getResponseBody();
    }
} catch (HttpException $ex) {
    echo $ex;
}
?>