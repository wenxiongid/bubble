var ret = [];

process.argv.forEach(function(val, index, array){
  if(index > 1){
    ret.push((val / 255).toFixed(2));
  }
});

console.log(ret.join(', '));