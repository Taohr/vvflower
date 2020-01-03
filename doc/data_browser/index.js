var vue = null
var flag = {
  'page': false,
  'data': false,
  'image': false,
}
var color = {
  "400":"",
  "401":"#F1F8E0",
  "402":"#FA5858",
  "403":"#FFBF00",
  "404":"#F3F781",
  "405":"#5FB404",
  "406":"#AC58FA",
  "407":"#F6CECE",
  "408":"#A9F5E1",
  "409":"#819FF7",
  "410":"#424242",
}
imageData = null

readImageData()
getImageList()
bindKeyboard()

function onload() {
  initVue()
  flag.page = true
  console.log('page loaded', flag)
  goReady()
}

function goReady() {
  for(var k in flag) {
    if (!flag[k]) {
      return
    }
  }
  ready()
}

function initVue() {
  var app = new Vue({
    el: '#main',
    data: {
      imageData: null,
      imagefiles: [],
      index: -1,
      color: color,
    },
    computed: {
      imageurl: function() {
        if (this.index == -1 || isNaN(this.index)) {
          return ''
        }
        return '../flower/'+this.imagefiles[this.index]
      },
      currentImageData: function() {
        if (this.index == -1 || isNaN(this.index)) {
          return null
        }
        return this.imageData.images[this.index]
      }
    },
    methods: {
      pagechange: function(value) {
        this.index = value
        this.checkindex()
      },
      preimage: function() {
        this.index--
        this.checkindex()
      },
      nextimage: function() {
        this.index++
        this.checkindex()
      },
      checkindex: function() {
        if (this.index < 0) {
          this.index = this.imagefiles.length-1
        } else if (this.index > this.imagefiles.length-1) {
          this.index = 0
        }
        this.logcurrent()
      },
      updateImagesData() {
        for (var i in this.imagefiles) {
          var file = this.imagefiles[i]
          var find = this.findimage(file)
          if (!find) {
            var image = { 'name': file, 'codes': [] }
            this.imageData.images.push(image)
          }
        }
        this.imageData.images.sort((x,y)=>{
          return x.name.localeCompare(y.name)
        })
      },
      findimage: function(item) {
        for (var i in this.imageData.images) {
          var image = this.imageData.images[i]
          if (image.name == item) {
            return image
          }
        }
        return null
      },
      typeclicked: function(e) {
        var code = parseInt(e.currentTarget.dataset.code)
        var file = this.imagefiles[this.index]
        var current = this.currentImageData
        var atindex = current.codes.indexOf(code)
        var exist = (atindex >= 0)
        if (!exist) {
          current.codes.push(code)
          current.codes.sort((x,y)=>{return x-y})
        } else {
          current.codes.splice(atindex, 1)
        }
        this.savedata()
        this.logcurrent()
        // /**/// console begin
        // /**/console.clear()
        // /**/var that = this
        // /**/setTimeout(function(){
        // /**/  var arr = that.imageData.images
        // /**/  var log = arr.reduce((pre, cur,index,arr)=>{
        // /**/    return pre + cur.name + ' : ' + JSON.stringify(cur.codes) + '\n'
        // /**/  }, '')
        // /**/  console.log(log)
        // /**/}, 0.1);
        // /**/// console end
      },
      savedata: function() {
        var data = JSON.stringify(this.imageData, null, '\t')
        // var data = JSON.stringify(this.imageData)
        localStorage.setItem('data', data)
      },
      download: function() {
        var data = JSON.stringify(this.imageData, null, '\t')
        // var data = JSON.stringify(this.imageData)
        download(data, 'images.json')
      },
      selected: function(code) {
        if (!this.currentImageData) {
          return false
        }
        return this.currentImageData.codes.indexOf(code) != -1
      },
      logcurrent: function() {
        console.clear()
        var cur = this.currentImageData
        if (!cur) {
          return
        }
        console.log(cur.name + ' : ' + JSON.stringify(cur.codes, null, '\t'))
      }
    }
  })
  vue = app
}

function readImageData() {
  var data = localStorage.getItem('data')
  if (data) {
    imageData = JSON.parse(data)
    flag.data = true
    console.log('read local storage data', data, imageData)
    goReady()
  } else {
    readData('images.json', (data) => {
      imageData = data
      flag.data = true
      console.log('read image data', data)
      goReady()
    })
  }
}

function getImageList() {
  var imagefiles = []
  var request = new XMLHttpRequest()
  request.open('get', 'images.txt')
  request.send(null)
  request.onload = function() {
    if (request.status == 200) {
      imagefiles = request.responseText
      vue.imagefiles = imagefiles.split('\r\n')
      if (vue.imagefiles.length > 0) {
        vue.index = 0
      }
      flag.image = true
      console.log(vue.imagefiles)
      goReady()
    }
  }
}

function readData(url, callback) {
  var request = new XMLHttpRequest()
  request.open('get', url)
  request.send(null)
  request.onload = function() {
    var json = null
    if (request.status == 200) {
      json = JSON.parse(request.responseText)
    }
    callback(json)
  }
}

function bindKeyboard() {
  document.onkeyup = function(event){
    var e = event || window.e
    var keyCode = e.keyCode || e.which
    var press = false
    switch(e.key){
      case 'a':
      case 'ArrowLeft':
        // pre
        vue.index--
        press = true
        break
      case 'd':
      case 'ArrowRight':
        // next
        vue.index++
        press = true
        break
    }
    if (!press) {
      return
    }
    vue.checkindex()
    // vue.updateCurrentImageData()
  }
}

function download (content, fileName) {
  let downLink = document.createElement('a')
  downLink.download = fileName
  let blob = new Blob([content])
  downLink.href = URL.createObjectURL(blob)
  document.body.appendChild(downLink)
  downLink.click()
  document.body.removeChild(downLink)
}

function ready() {
  console.log('ready!')
  vue.imageData = imageData
  vue.updateImagesData()
}

function pagechange(input) {
  vue.pagechange(+input.value)
  input.blur()
}
