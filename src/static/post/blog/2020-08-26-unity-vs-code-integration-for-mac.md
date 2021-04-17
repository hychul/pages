이전에 Windows 환경에서 VsCode를 유니티에서 사용하기 위한 세팅 글을 쓴적이 있었다.

메인 개발 PC를 Mac으로 변경하고 다시 게임 개발을 취미로 해볼까 해서 Unity를 설치하고 [vscode 홈페이지에서 설명하는 유니티 세팅 방법](https://code.visualstudio.com/docs/other/unity)으로 세팅한 후 VSCode를 켰는데 `Error : The reference assemblies for .NETFramework, Version = v4.7.1 were not found` 에러가 반겨주었다. 
이상태로는 VsCode 자체를 사용 못하는 건 아니지만, .Net 지원이 되지 않아 Intelli Sense 등이 동작하지 않아, 기본 메모장에서 개발하는 것과 다를게 없다.

여러 삽질을 하다가 찾은 그 해결 방법을 적어 보았다.

먼저 위에서 언급한 vscode 홈페이지에서 설명하는 것과 같이 진행하면 되는데, mono 를 설치할 때 비주얼 스튜디오를 사용하는 것이 아니기 때문에 최신 버전의 'Stable Channel' 버전으로 설치한다. 공식 문서에 설명이 되어있지 않지만 컴퓨터를 재시동해야 설치된 mono가 제대로 동작한다.  
재시동 후 아래의 명령어를 통해 mono가 제대로 설치 되었는지 확인한다.

```terminal
$ mono -V
```

설치가 잘 되었다면 VsCode를 실행하고 'Code > Preference > Setting'으로 이동한 후, 검색창에 'useGlobalMono'를 적고 옵션을 'always'로 변경한다. 그다음 'Edit in setting.json' 을 클릭하여 mono의 경로를 입력한다. mono의 경로는 아래의 명령어를 통해 알 수 있다.

```terminal
$ which mono
```

그 이후 VsCode를 재실행 하면 에러없이 동작하는 것을 알 수 있다.