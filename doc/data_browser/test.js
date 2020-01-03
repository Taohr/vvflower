var fs = require('fs')

function load(filename, success=()=>{}, fail=()=>{}) {
  fs.readFile(filename, function(error, data) {
    if (error) {
      fail(error)
    } else {
      var str = data.toString()
      success(str)
    }
  })
}

function save(filename, str, success=()=>{}, fail=()=>{}) {
  fs.writeFile(filename, str, function(error) {
    if (error) {
      fail(error)
    } else {
      success()
    }
  })
}

var arr =  [
    {
      "name": "IMG_1691.JPG",
      "codes": [
        410
      ]
    },
    {
      "name": "IMG_1692.JPG",
      "codes": [
        501,
        503
      ]
    },
    {
      "name": "IMG_1698.JPG",
      "codes": []
    }
  ]

  console.log(arr)

  arr = arr.reduce((pre, cur, index, arr)=>{
    return pre + '\n' + JSON.stringify(cur)
  }, '')

  console.log(arr)