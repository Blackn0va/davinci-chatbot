import React from 'react'

export function SettingsSection({
                           tempAiName,
                           aiName,
                           tempAttributes,
                           attributes,
                           onChangeAiName,
                           onChangeAttributes,
                           tmpApiKey,
                           apiKey,
                           onChangeApiKey,
                           saveSettings,
                           resetConversation
                         }) {

  return <section id="aside" className="full md:half lg:quarter lg:screen-v-scroll flex row wrap">
    <div className="pt px">
      <form onSubmit={saveSettings}>
        <span className={tempAiName !== aiName ? 'fuschia' : 'orange'}>KI Name</span>
        <input type="text"
               spellCheck={false}
               value={tempAiName}
               placeholder={'KI Name'}
               onChange={onChangeAiName}/>
        <br/>
        <br/>
        <span className={tempAttributes !== attributes ? 'fuschia' : 'orange'}>Attributes</span>
        <input type="text"
               spellCheck={false}
               value={tempAttributes}
               placeholder={'Attributes'}
               onChange={onChangeAttributes}/>
        <br/>
        <br/> 
       <button type="submit" style={{visibility: 'hidden'}}>Speichern</button>
      </form>
      <a href={'#'} onClick={saveSettings} className={'green hover'}>Speichern</a>
      <a href={'#'} onClick={resetConversation} className={'fuschia hover'}>Zurücksetzen</a>
    </div>
  </section>
}
