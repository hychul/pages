윈도우에서 Git Bash를 사용하는 경우 기본적으로 터미널에 출력되는 텍스트에 컬러가 적용되어 있지만, 맥의 경우 그냥 깃을 설치하는 것 만으로 텍스트의 색이 상태에 따라 변하지 않아 직관적으로 보기 힘들다. 다행이 이런 상태에 따른 텍스트 컬러의 설정은 Git 자체에서 지원한다. 다음의 명령어들을 사용하면 상태별로 다른 색상을 출력할 수 있다.

```shell
git config --global color.ui true
git config --global color.status.changed "magenta normal"
git config --global color.status.untracked "red normal"
git config --global color.status.added "green normal"
git config --global color.status.updated "green normal"
git config --global color.status.branch "cyan normal bold blink"
git config --global color.status.header "yellow normal"
```

 색상을 설정하는 파라메터의 정규형은 다음과 같다.

```
"{텍스트 색상 값} {텍스트 배경 색상 값} {강조 표시:옵션} ..."
```

> 색상 값
>
> ```
> normal
> black
> red
> green
> yellow
> blue
> magenta
> cyan
> white
> ```

> 강조 표시
>
> ```
> bold
> dim
> ul
> blink
> reverse
> ```

