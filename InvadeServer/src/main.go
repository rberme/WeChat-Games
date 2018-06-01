package main

import (
	"log"
	"net/http"
	"sync/atomic"
)

var hub = newHub()

type clients struct {
}

func serveHome(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL)
	if r.URL.Path != "/" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	http.ServeFile(w, r, "home.html")
}

func main() {

	// buff, _ := json.Unmarshal("[1,2,3]")
	// fmt.Println(buff)
	// return

	var clientID int32
	go hub.start()
	http.HandleFunc("/", serveHome)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		atomic.AddInt32(&clientID, 1)
		serveWs(clientID, w, r)
	})
	
	err := http.ListenAndServe("192.168.0.189:8338", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
