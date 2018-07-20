package network

// Agent .
type Agent interface {
	Run()
	OnClose()
}
