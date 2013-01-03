test:
	./node_modules/.bin/mocha \
	--reporter list

test-all: test

 .PHONY: test