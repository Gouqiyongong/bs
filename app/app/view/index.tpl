<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="HandheldFriendly" content="true">
  <meta name="renderer" content="webkit">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0">
  <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <title>FISH!</title>
  <script>
    (function flexible (window, document) {
  var docEl = document.documentElement
  var dpr = window.devicePixelRatio || 1

  // adjust body font size
  function setBodyFontSize () {
    if (document.body) {
      document.body.style.fontSize = (12 * dpr) + 'px'
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit () {
    var rem = docEl.clientWidth / 10
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))
  </script>
  <!-- favicon -->
  <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
  <!-- 基础的CSS -->
  <link href="/public/static/normalize.min.css" rel="stylesheet">
  <link href="/public/static/main.css" rel="stylesheet">
</head>
<script type="text/javascript">
  window._context={}
</script>
<body>
  <div id="root"></div>
</body>
</html>