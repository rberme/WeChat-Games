package llog_test

import (
	"llog"
	"log"
)

func Example() {
	name := "Leaf"

	llog.Debug("My name is %v", name)
	llog.Release("My name is %v", name)
	llog.Error("My name is %v", name)
	// log.Fatal("My name is %v", name)

	logger, err := llog.New("release", "", log.LstdFlags)
	if err != nil {
		return
	}
	defer logger.Close()

	logger.Debug("will not print")
	logger.Release("My name is %v", name)

	llog.Export(logger)

	llog.Debug("will not print")
	llog.Release("My name is %v", name)
}
