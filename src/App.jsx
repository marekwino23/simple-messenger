import './App.css';
import React, {useEffect, useState} from "react";
import io from "socket.io-client"
let socket;
const CONNECTION_PORT = 4000;

const App = () => {
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [messageList, setMessageList] = useState([]);
  const [loggedIn, setLoggedin] = useState(false)

  const changeMessage = (e) => {
    setMessage(e.target.value)
  }
  const changeUsername = (e) => {
    setUsername(e.target.value)
  }

  const changeRoom = (e) => {
    setRoom(e.target.value)
  }

  const exitRoom = () => {
    setLoggedin(false)
  }

  useEffect(() => {
    socket = io(`localhost:${CONNECTION_PORT}`);
  },[]);

  const connectToRoom = () => {
    setLoggedin(true)
    socket.emit("join_room", room, username)
    if(username !== "" && room !== ""){
    }
    else{
      console.log("empty")
    }  
  }

  const sendMessage = () => {
    let messageContent = {
      room: room,
      content:{
        author: username,
        message: message,
      },
    };
    socket.emit("send_message", messageContent)
    // setMessageList([...messageList, messageContent.content])
    socket.on("receive_message", (messages) => {
      console.log( "data", messages)
      setMessageList(messages);
      console.log(messageList)
    })
    }
  
  // if(!socket) {
  //   return null;
  // }
  console.log('messagesList: ', messageList);
  return (
      <div>
        {!loggedIn ? (
        <div className="App">
        <h1 style={{color:"red"}}>You are not logged in</h1>
        <input required onChange={changeUsername} placeholder="username..." type="text"/>
        <select required onChange={changeRoom}>
          <option></option>
          <option value="Poland">Poland</option>
          <option value="Germany">Germany</option>
          <option value="Italy">Italy</option>
        </select>
        <button onClick={connectToRoom}>Enter</button>
      </div>)
   :(
     <div className="message_container">
     <h1 style={{color:"green"}}>You are logged in {room} <button onClick={exitRoom} className="exit">Exit</button></h1>
    <input onChange={changeMessage} placeholder="message..." type="text"/>
   <button onClick={sendMessage}>Send</button>
   <br></br>
   <br></br>

   {messageList.map((message) => {
     return(
       <div>
      <li key={message.id}>{message.content.author === username ? 'Ja' : message.content.author}: {message.content.message}</li>
      </div>
     )
   })}
     </div>)}
     </div>

   )}

export default App;
