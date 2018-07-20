// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"bytes"
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients. 已注册的客户端
	clients map[*Client]bool

	// Inbound messages from the clients.
	//broadcast chan []byte

	roomcast chan *message

	// Register requests from the clients. 来自客户端的注册请求
	register chan *Client

	// Unregister requests from clients. 来自客户端的注销请求
	unregister chan *Client
}

func newHub() *Hub {
	return &Hub{
		//broadcast:  make(chan []byte),
		roomcast:   make(chan *message),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (me *Hub) start() {
	var roomID int32
	for {
		select {
		case client := <-me.register:
			for c := range me.clients {
				atomic.AddInt32(&roomID, 1)
				go me.startBattle(int(roomID), c, client)
				return
			}
			me.clients[client] = true
		case client := <-me.unregister:
			if _, ok := me.clients[client]; ok {
				delete(me.clients, client)
				close(client.send)
			}
			// case message := <-me.broadcast:
			// 	for client := range me.clients {
			// 		select {
			// 		case client.send <- message:
			// 		default:
			// 			close(client.send)
			// 			delete(me.clients, client)
			// 		}
			// 	}
			// case msg := <-me.roomcast:
			// 	room, ok := me.rooms[msg.Sender]
			// 	if ok == false {
			// 		continue
			// 	}
			// 	room[0].send <- []byte(msg.Content)
			// 	room[1].send <- []byte(msg.Content)
		}
	}
}

func (me *Hub) startBattle(rID int, cs ...*Client) {

	var cmdBuff []string
	roomcast := make(chan string)

	defer func() {
		close(roomcast)
		for _, c := range cs {
			me.clients[c] = true
		}
	}()

	mut := new(sync.Mutex)

	go func() {
		for {
			cmd, ok := <-roomcast
			if ok == false {
				return
			}
			mut.Lock()
			cmdBuff = append(cmdBuff, cmd)
			mut.Unlock()
		}
	}()

	for _, c := range cs {
		delete(me.clients, c)
		c.roomID = rID
		c.roomcast = roomcast
	}
	frames := 0

	//[frames,[opt0],[opt1],[opt2],...]

	temp := []string{}
	for {
		mut.Lock()
		if len(cmdBuff) > 0 {
			temp = cmdBuff
			cmdBuff = nil
		}
		mut.Unlock()
		str := ""
		if temp != nil {
			var buff bytes.Buffer
			buff.WriteString(fmt.Sprintf("[%d", frames))
			for _, opt := range temp {
				buff.WriteString(fmt.Sprintf(",%s", opt))
			}
			buff.WriteString("]")
			temp = []string{}
			str = buff.String()
		} else {
			str = fmt.Sprintf("[%d]", frames)
		}
		for _, c := range cs {
			c.send <- []byte(str)
		}
		frames++
		time.Sleep(time.Millisecond * 67)
	}

}

// func (me *Hub) destroyRoom(rID int) {
// 	room := me.rooms[rID]
// 	delete(me.rooms, rID)

// 	c1 := room[0]
// 	c2 := room[1]

// 	c1.roomID = 0
// 	c2.roomID = 0

// 	me.clients[c1] = true
// 	me.clients[c2] = true

// }

// func (h *Hub) mainLoop() {
// 	for {
// 		if len(h.clients) > 1 {
// 			if len(optBuffer) > 0 {
// 				h.broadcast <- optBuffer[0]
// 				optBuffer = [][]byte{}
// 			} else {
// 				h.broadcast <- []byte("[123]")
// 			}
// 		}
// 		time.Sleep(time.Millisecond * 67)
// 	}
// }
