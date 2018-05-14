package main

// 消息码
const (
	MsgCodeStart = iota
)

// MsgHandler 消息处理
type MsgHandler struct {
}

// MsgCodeStart 消息处理的例子
func (me *MsgHandler) MsgCodeStart() {
}
