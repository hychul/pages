맥 터미널에서 자동완성

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

sudo bash -c 'printf "set completion-ignore-case on\nset show-all-if-ambiguous on\nTAB: menu-complete" >> ~/.inputrc'