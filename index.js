var Combinatorics = require('js-combinatorics');
var async = require('async');
// This program is for dialouge delivery only


var botconfig={

};

botconfig['mood']=0;
// 0 indicates neutral


//
var getResponseObject = function(output)
{
  return {
    'neg':0,
    'pos':0, //
    'nu':1, // we start with 1 neutrals if the item has been learnt from outside world

    'type':'response',
    'value':output
  };
}



var map = {};

var trainingSet= [
  {
    'input':'how are you?',
    'output':'i am good'
  },
  {
    'input':'hey',
    'output':'hello'
  },
  {
    'input':'what the hell',
    'output':'nothing man'
  },
  {
    'input':'sky is blue',
    'output':'okay'
  },
  {
    'input':'who are you',
    'output':'I am {name}'
  }
]

var getTextWithNoRepition = function(text)
{
  var textwithnorepition = '';

  for (var i = 0, len = text.length; i < len; i++) {
    var char = text[i];

    if(i>0)
    {
      if(
        char == text[i-1]
      )
      {

      }
      if(['?',','].indexOf(char)>-1)
      {

      }
      else
      {
        textwithnorepition+=char;
      }
    }
    else {
      textwithnorepition+=char;
    }
  }

  return textwithnorepition;
}
var trainOnText = function(data,callback)
{
  var text = data.input;
  var output = data.output;

  var textwithnorepition = getTextWithNoRepition(text);

  setResponseInMap(map,textwithnorepition,0,output);

  callback();
}

var setResponseInMap = function(map,input,location,output)
{
  var char = input.substring(location,location+1);
  if(!map[char])
  {
    map[char]={};
  }
  // console.log(location,input.length);
  if(location == input.length-1)
  {
    if(!map[char]['output'])
      map[char]['output']=[];

    map[char]['output'].push(getResponseObject(output))
    return null;
  }
  else
  {
    return setResponseInMap(map[char],input,location+1,output)
  }
}

async.each(trainingSet,trainOnText,function(e){
  console.log(JSON.stringify(map));
  // process.exit();
})
// comma indicates a break
// exclamantion and questionmark indicate the type of statement

// repetitive characters can be replaced
// though first priority will be given to the exact match
// vowels can also be ignored - if no response is found

// similar sounding characters
// ey - i

// if similar characters are found together, intensity of the statement goes up
var getcombinations = function(text)
{
  var words = userinput.split(' ');
  return Combinatorics.permutationCombination(words).toArray();
  // return all combinations of the text
}

// Let's get started

var userinput = 'hey how are you';
var statementmood='0000'; // fixed for now
userinput = getTextWithNoRepition(userinput);
// console.log('use text for combinations',userinput)
combinations = getcombinations(userinput);
// console.log('combinations',combinations);

var isVowel = function(char)
{
  if(['a','e','i','o','u'].indexOf(char)>-1)
  {
    return true;
  }

  return false;
}

getAllChildResponsesWithDistance = function(map,lvl,callback)
{
  // console.log('getAllChildResponsesWithDistance',map,lvl)
  var responses = [];

  async.eachOf(map,function(key,val,callback2)
  {
    if(map[key]['output'])
    {
      async.each(map[key].output,function(o,callback3){
        responses.push({'text':o.value,'distance':lvl});
        callback3();
      },function(e){
        callback2();
      })
    }
    else {
      getAllChildResponsesWithDistance(map[key],lvl+1,callback2)
    }
  },
  function(e)
  {
    callback(null,responses);
  })
}
var iterateOverMapToGetResponses = function(map,text,location,confidence,pathtraversed,prevoutput,callback)
{

  var char = text.substring(location,location+1);

  // console.log('iterateOverMapToGetResponses',text,confidence)


  if(location==text.length-1)
  {
    if(map[char] && map[char]['output']) // char found and end also found
    {
      pathtraversed+=char;

      callback(null,{
        'confidence':confidence*0.99,
        'value':map[char]['output'][0]['value'],
        'text':text,
        'pathtraversed':pathtraversed
      })
    }
    else {
      // reached end but nothing found - return last found item?

      if(prevoutput)
      {
        callback(null,{
          'confidence':confidence*0.1,
          'text':text,
          'suggestion':pathtraversed,
          'value':prevoutput.value
        });
      }
      else {

        callback(null,{
          'confidence':0,
          'text':text
        });
      }
    }
  }
  else
  {
    pathtraversed+=char;
    if(!map[char])
    {
      callback(null,{
        'confidence':0.1,
        'text':text,
        'pathtraversed':pathtraversed
      });


    }
    else
    {
      if(map[char]['output'])
      {
        prevoutput = map[char]['output']
      }
      iterateOverMapToGetResponses(map[char],text,location+1,confidence*0.99,pathtraversed,prevoutput,callback);
    }
  }
}

var getResponseForCombination = function(text,callback){

  var userinput = this;

  // console.log('getResponseForCombination',text.length,userinput.length);
  var textwithnorepition = getTextWithNoRepition(text);
  iterateOverMapToGetResponses(map,text,0,text.length/userinput.length,'',null,callback);
}


var stopwords = ['are','an','at'];
async.map(combinations,function(combination,callback){
  var text = combination.join(' ');
  if(stopwords.indexOf(text)==-1)
    (getResponseForCombination.bind(userinput))(text,callback);
  else
  {
    callback(null,null)
  }
},function(e,r){
  console.log('top 3 responses');
  r = r.filter(function(a){
    if(a && a.confidence)
      return true;
  });
  r.sort(function(a,b){
    return b.confidence-a.confidence;
  })

  for(var i=0;i<=3 && (i < r.length);i++)
  {
    console.log(r[i]);
  }
});




//
