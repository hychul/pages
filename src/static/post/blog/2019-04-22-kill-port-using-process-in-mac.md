가끔 로컬에서 서비스를 띄워서 확인을 하다 보면 IDE 버그인 건지 포트가 닫히지 않은채로 서비스가 종료되어 다른 서비스를 띄우려고 할때 포트가 사용중이라는 에러가 뜨면서 띄어지지 않는 경우가 있다.

이럴 경우 lsof 명령어를 통해서 8080 포트를 사용하고 있는 프로세스를 알아낸 다음 해당 프로세스를 죽이면 된다.

```terminal
$ lsof -i :8080
COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME 
node 1234 shaking 15u IPv4 0x1f23462a48d69d65 0t0 TCP localhost:cslistener (LISTEN)
$ kill -9 1234
```