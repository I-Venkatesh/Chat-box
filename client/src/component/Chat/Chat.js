import React, {useState, useEffect} from "react";
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
let socket;
var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
};

socket = io.connect('https://chatapp2510.herokuapp.com/',connectionOptions);

const Chat = ({ location }) => {
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [messages,setMessages] = useState([]);
    const [message,setMessage] = useState('');


    const ENDPOINT = 'https://chatapp2510.herokuapp.com/';
    useEffect(() => {
        const {name,room} = queryString.parse(location.search);

        socket = io(ENDPOINT)

        setName(name);
        setRoom(room);

        socket.emit('join',{name,room}, () => {
    
        });
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    },[ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message',(message) => {
            setMessages([...messages,message]);
        })
    },[messages]);

    const sendMessage = (event) => {
        event.preventDefault();
        if(messages){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }
    console.log(message,messages);
    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
                
            </div>
            {/* <img src="../../imgs/waves2.svg"/> */}
        </div>
    )
}

export default Chat;