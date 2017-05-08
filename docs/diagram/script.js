

$(function () {

  let config = {
    wBoundry: 900,
    hBoundry: 500,
    duration: 1000,
    ease: 'easeInOutSine'
  }

  config.outPadding = config.wBoundry * 0.03
  config.wContainer = config.wBoundry * 0.25
  config.hContainer = config.hBoundry * 0.35;
  config.wCenter = (config.wBoundry / 2) - (config.wContainer / 2)

  let docStyle = document.documentElement.style
  Object.keys(config).forEach(x => {
    docStyle.setProperty('--' + x, config[x] + 'px')
  })

  let svg = document.querySelector('#paths')
  svg.setAttribute('width', config.wBoundry)
  svg.setAttribute('height', config.hBoundry)

  let rightTopPath =  document.createElementNS("http://www.w3.org/2000/svg", 'path')

  let loc = {
    start: {
      x: config.wBoundry - config.outPadding - config.wContainer / 2,
      y: config.hBoundry - config.hContainer - config.outPadding + 20
    },
    end: {
      x: config.wCenter + config.wContainer / 2,
      y: config.hContainer / 2 + config.outPadding
    }
  }
  rightTopPath.setAttribute('id', 'right-top')
  rightTopPath.setAttribute('d',
      `M ${loc.start.x} ${loc.start.y} Q ${loc.start.x} ${loc.end.y} ${loc.end.x} ${loc.end.y}`)

  svg.append(rightTopPath)

  let topCenterPath =  document.createElementNS("http://www.w3.org/2000/svg", 'path')

  loc = {
    start: {
      x: config.wCenter + config.wContainer / 2,
      y: config.hContainer / 2 + config.outPadding
    },
    end: {
      x: config.wCenter + config.wContainer / 2,
      y: config.hBoundry - (config.hContainer / 2 + config.outPadding)
    }
  }
  topCenterPath.setAttribute('id', 'top-center')
  topCenterPath.setAttribute('d',
      `M ${loc.start.x} ${loc.start.y} L ${loc.end.x} ${loc.end.y}`)

  svg.append(topCenterPath)

  var tl = anime.timeline({
    autoplay: false
  })

  var rightTop = anime.path('svg #right-top')
  var topCenter = anime.path('svg #top-center')

  let ev = document.querySelector('#event')

  let stateFirst = document.querySelector('#state-first')

  tl.add({
    targets: ev,
    left: rightTop('x'),
    top: rightTop('y'),
    duration: config.duration,
    easing: config.ease
  })
  .add({
    targets: ev,
    easing: config.ease,
    borderRadius: 0,
    width: 100,
    height: 50,
    lineHeight: '50px',
    marginLeft: -50,
    marginTop: -25,
    fontSize: 20,
    duration: config.duration / 2,
    begin: anim => {
      ev.innerText = 'Patch'
    }
  })
  .add({
    targets: ev,
    left: topCenter('x'),
    top: topCenter('y'),
    duration: config.duration,
    easing: config.ease
  })
  .add({
    targets: ev,
    opacity: 0,
    easing: config.ease,
    duration: config.duration / 2,
    offset: '-=' + config.duration / 1.5,
    rotate: '30deg'
  })
  .add({
    targets: stateFirst,
    opacity: 1,
    easing: config.ease,
    duration: config.duration / 3,
    offset: '-=' + config.duration / 2.5,
    begin: x => {
      $(stateFirst).css('display', 'block')
    }
  })

  tl.play()

})
