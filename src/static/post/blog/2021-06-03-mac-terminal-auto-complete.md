맥 환경에서 Git을 사용할 때 자동완성이 안되어 의아했는데 따로 설정을 해줘야 자동완성/추천 기능의 사용이 가능했다.

두 방식 모두 알 수 있듯이 `.inputrc` 파일을 생성하고 설정을 추가하는 방식이다.

```terminal
$ cd ~
$ vi .inputrc
```

```vi
set completion-ignore-case on
set show-all-if-ambigous on
TAB:menu-complete
```

or

```terminal
$ sudo bash -c 'printf "set completion-ignore-case on\nset show-all-if-ambiguous on\nTAB: menu-complete" >> ~/.inputrc'
```