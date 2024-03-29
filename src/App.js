import React, {useEffect, useState} from 'react'
import {Configuration, OpenAIApi} from 'openai'
import {AsideSection} from './navigation/AsideSection'
import {Loader} from './Loader'
import {SettingsSection} from './chat/SettingsSection'
import {fillStringLength} from './__helper__/text-helper'
import {MainContent} from './chat/ChatSection'
 
function defaultConversation(aiName, attributes) {
  return `Es folgt ein Gespräch mit einer KI namens ${aiName}.
Die KI ist ${attributes}.\n\n`
}

function getEngineId() {
  return 'text-davinci-003'
}

function App() {
  const [aiName, setAiName] = useState('Open AI')
  const [tempAiName, setTempAiName] = useState('Open AI')
  const [attributes, setAttributes] = useState('Freundlich Hilfsbereit')
  const [tempAttributes, setTempAttributes] = useState('Freundlich Hilfsbereit')
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '')
  const [tempApiKey, setTempApiKey] = useState(localStorage.getItem('apiKey') || '')

  const [loading, setLoading] = useState(false)

  const [errorMessage, setErrorMessage] = useState(null)

  const [showConversationDebug, setShowConversationDebug] = useState(false)

  const [conversation, setConversation] = useState(defaultConversation(aiName, attributes))

  const [question, setQuestion] = useState('')

  const [conversationHistory, setConversationHistory] = useState([])

    
  function getPrompt(question) {
    return `${conversation}Human:${question}\n
    ${aiName}:`
  }

  const askQuestion = (question) => {
    const configuration = new Configuration({apiKey})
    const openai = new OpenAIApi(configuration)

    return new Promise((resolve, reject) => {
      openai.createCompletion(getEngineId(), {
        prompt: getPrompt(question),
        temperature: 0.5,
        max_tokens: 2000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }).then((response) => {
        let text = response.data.choices[0].text
        if (text && text.length > 0) {
          setConversation(`${getPrompt(question)}${text}`)


          //if text contains a link post the chat to the chatbox and the link in a new line
          let link = text.match(/https?:\/\/[^\s]+/g)
          if (link) {
            link = link[0]
            text = text.replace(link, '')
          }
          //if link = null then link = ''
          if (link == null) {
            resolve(text + '\n')
            
            setQuestion('')
          }
          else
          {
            resolve(text + '\n' + link)
            setQuestion('')

          }
          reject('Keine Antwort erhalten')
        }
      }).catch((e) => {
        reject(e)
      })
    })
  }


  function resetConversation() {
    setConversation(defaultConversation(aiName, attributes))
    setConversationHistory([])
    setErrorMessage(null)
  }

  function saveConversationSettings(e) {
    e.preventDefault()
    setConversationHistory([])
    setAiName(tempAiName)
    setAttributes(tempAttributes)
    setApiKey(tempApiKey)
    // save api key to local storage if it is not empty and not already saved
    if (tempApiKey && tempApiKey !== '' && localStorage.getItem('apiKey') !== tempApiKey) {
      localStorage.setItem('apiKey', tempApiKey)
    }

    setErrorMessage(null)
  }

  useEffect(() => {
    setConversation(defaultConversation(aiName, attributes))
  }, [aiName, attributes])

  function poseQuestion(e) {
    if (loading) {
      return
    }
    e.preventDefault()

    if (apiKey === '') {
      setErrorMessage('Bitte gib einen API Key ein!')
      return
    } else if (question === '') {
      setErrorMessage('Bitte gib eine Frage ein!')
      return
    } else {
      setErrorMessage(null)
    }

    setLoading(true)

    askQuestion(question).then((response) => {
      setLoading(false)
      // add message from human and message from AI
      setConversationHistory([
        ...conversationHistory,
        {from: 'Human', text: question, color: 'secondary'},
        {from: aiName, text: response, color: 'primary'}
      ])
    }).catch((e) => {
      setLoading(false)
      setConversationHistory([
        ...conversationHistory,
        {from: 'Human', text: question, color: 'secondary'},
        {from: aiName, text: 'No response', color: 'danger'}
      ])
      console.log(e)
    })
  }

  return <div className="full h-min-screen">
    <div className="flex row wrap">
      <SettingsSection tempAiName={tempAiName}
                       aiName={aiName}
                       tempAttributes={tempAttributes}
                       attributes={attributes}
                       apiKey={apiKey}
                       onChangeAiName={(e) => setTempAiName(e.target.value)}
                       onChangeAttributes={(e) => setTempAttributes(e.target.value)}
                       tmpApiKey={tempApiKey}
                       onChangeApiKey={(e) => setTempApiKey(e.target.value)}
                       saveSettings={saveConversationSettings}
                       resetConversation={resetConversation}/>
      <section id="content" className="full md:half lg:screen-v-scroll flex row wrap relative">
        <div className="full md:py px">
          <center>
            <span className="large title white"></span>
          </center>
          <br/>
          <br/>
          <MainContent showConversationDebug={showConversationDebug}
                       conversationHistory={conversationHistory}
                       conversation={conversation}
                       loading={loading}
                       apiKey={apiKey}
                       aiName={aiName}/>
          {loading ? <>
              Human: <span className={'blue'}>
              {fillStringLength('Human', aiName)}
              {question}
            </span>
              <center>
                <Loader/>
              </center>
            </>
            : <>
              <br/>
              <br/>
            </>}

          <br/>

          <form onSubmit={poseQuestion}>
            <input type="text"
                   value={question}
                   placeholder={'Stell deine Frage'}
                   spellCheck={false}
                   onChange={(e) => setQuestion(e.target.value)}/>
            {errorMessage && <span className={'fuschia'}>{errorMessage}</span>}
          </form>
        </div>
      </section>
      <AsideSection showConversationDebug={showConversationDebug}
                    setShowConversationDebug={setShowConversationDebug}/>
    </div>
  </div>
}


export default App