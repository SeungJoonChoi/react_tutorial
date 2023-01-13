import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

const Header = (props) => {
  return <header>
    <h1 ><a className="Header-name" href="/" onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
  </header>
}

const Nav = (props) => {
  const lis = []
  for(let i = 0; i < props.topics.length; ++i){
    let t = props.topics[i];
    lis.push(<a key={t.id} id={t.id} href={'/read/'+t.id} onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode(Number(event.currentTarget.id));
    }}><li>{t.title}</li></a>);
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

const Article = (props) => {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

const Create = (props) => {
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="body" placeholder="body"></textarea></p>
      <div><p><button type="submit">✅Create</button>
      <button type="button" onClick={()=>{
        props.onCancel();
      }}>❌Cancel</button></p></div>
    </form>
  </article>
}

const Update = (props) => {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
  <h2>Update</h2>
  <form onSubmit={event=>{
    event.preventDefault();
    const title = event.target.title.value;
    const body = event.target.body.value;
    props.onUpdate(title, body);
  }}>
    <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
      setTitle(event.target.value);
    }}/></p>
    <p><textarea name="body" placeholder="body" value={body} onChange={event=>{
      setBody(event.target.value);
    }}></textarea></p>
    <div><p><button type="submit">✅Update</button>
      <button type="button" onClick={()=>{
        props.onCancel();
      }}>❌Cancel</button></p></div>
  </form>
</article>
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'},
  ])
  let content = null;
  let contextControl = <button type="button" onClick={()=>{
    setMode('CREATE');
  }}>Create</button>;
  if(mode === 'WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>;
  } else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; ++i){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <button type="button" onClick={()=>{
        setMode('CREATE');
      }}>Create</button>
      <button type="button" onClick={()=>{
        setMode('UPDATE');
      }}>Update</button>
      <button type="button" onClick={()=>{
        setMode('DELETE');
      }}>Delete</button>
    </>
  } else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopics = [...topics];
      const newTopic = {id:nextId, title:_title, body:_body};
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId((current) => current + 1);
    }} onCancel={()=>{
      if(id !== null)
        setMode('READ');
      else
        setMode('WELCOME');
    }}></Create>
    contextControl = null;
  } else if(mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length; ++i){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(_title, _body)=>{
      const newTopics = [...topics];
      const updatedTopic = {id:id, title:_title, body:_body};
      // newTopics[id-1] = updatedTopic;
      // '키'를 기준으로 정리되기 때문에 위와 같이 '인덱스'에 대입하면 좋지 않음.
      for(let i=0; i<newTopics.length; ++i){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }} onCancel={()=>{
      setMode('READ');
    }}></Update>;
    contextControl = null;
  } else if(mode === 'DELETE'){
    const newTopics = [];
    for(let i=0; i<topics.length; ++i){
      if(topics[i].id !== id){
        newTopics.push(topics[i]);
      }
    }
    setTopics(newTopics);
    setMode('WELCOME');
    setId(null);
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Header id="Header-name" title="WEB" onChangeMode={()=>{
          setMode('WELCOME');
          setId(null);
        }}></Header>
        <Nav topics={topics} onChangeMode={(_id)=>{
          setMode('READ');
          setId(_id);
        }}></Nav>
        {content}
        <div className="Buttons">
          {contextControl}
        </div>
      </header>
      
    </div>
  );
}

export default App;
