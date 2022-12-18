import React from 'react'
import {fillStringLength} from '../__helper__/text-helper'
import TypeAnimation from 'react-type-animation'

export function MainContent({
                          showConversationDebug,
                          conversation,
                          loading,
                          conversationHistory,
                          aiName,
                          apiKey,
                        }) {

  function getBotMessage(msg, index, length) {
    if (msg.text === 'No response') {
      return <span className={'fuschia'}>
        {fillStringLength(aiName, 'Du')}
        <i className={'grey'}>{'// No Response'}</i>
        </span>
    } else {
      return <span className={'green'}>
        {index === length - 1 ? <TypeAnimation cursor={false}
                                               sequence={[msg.text]}
                                                typeSpeed={1500}
                                                backSpeed={1500}
                                                loop={false}
                                                speed={150}
                                               wrapper={'span'}
        /> : msg.text}
      </span>
    }
  }


  if (!showConversationDebug) {
    if (apiKey === '' && !loading) {
      return <center>
        <span className={'fuschia'}>Bitte füge einen API Key ein</span>
        <br/>
        <br/>
      </center>
    }
    if (conversationHistory.length === 0 && !loading) {
      return <center className={'green'}>Stelle eine Frage, die KI wird antworten<br/></center>
    }
    return <>
      {conversationHistory.map((msg, index) => {
        return <div key={index}>
          {msg.from}: {msg.from === 'Du'
          ? <span className={'blue'}>{fillStringLength('Du', aiName)}{msg.text}</span>
          : getBotMessage(msg, index, conversationHistory.length)}
        </div>
      })}
    </>
  } else {
    return <>
      <div>
          <pre>
            {conversation}
            <hr/>
            {JSON.stringify(conversationHistory, null, 2)}
          </pre>
      </div>
    </>
  }
}
