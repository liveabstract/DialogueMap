# DialogueMap
Since conventional neural net based systems fail to perform well on lesser amount of data. There is a need of a system which is able to respond with decent accuracy without a need of huge amounts of data

### Training
Current build gives an example where the bot is trained on - 
```
[
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
```





### Testing

If the bot is tested for the exact or somewhat different statement - it gives a decent response. Bot is capable of giving multiple responses to a single statement.

For instance-

USER: *hey how are you*

BOT: 
 
```
{ confidence: 0.6565813864563921,
  value: 'i am good',
  text: 'how are you',
  pathtraversed: 'how are you' }
{ confidence: 0.1940598,
  value: 'hello',
  text: 'hey',
  pathtraversed: 'hey' }
```


### Response Format
```
{
  'confindence':CONFIDENCE_SCORE, // Confidence score of the response
  'value':BOT_SAYS, // Text output from bot
  'text': TEXT_ASSUMED, // Input text recived by the bot
  'pathtraversed': PATH_FOLLOWED // Path that the evaluation function followed to get the final response
}
```
