Unity가 2018 버전으로 넘어가면서 .NET을 4.X 버전을 기본으로 제공하면서 OmniSharp 콘솔에 다음과 같은 에러 로그가 출력되며 제대로 프로젝트가 로드되지 않을 수 있다. 

![unity-vs-code-integration-3](https://user-images.githubusercontent.com/18159012/49001893-51d8ee00-f1a1-11e8-9c70-b3b0f6e9f1ea.PNG)

 VS Code C# 플러그인이 로드될때 4.5버전의 .NET Framework을 찾지 못해서 이기 때문에 4.5버전의 .NET Framework SDK를 다운 받으면 된다.

# .NET Framework SDK 다운로드

 Unity가 2018 버전에서 4.X 버전의 .NET Framework를 지원하지만 프로젝트 파일을 열어보면 4.5버전대를 지원하도록 설정되어 있다.

![unity-vs-code-integration-4](https://user-images.githubusercontent.com/18159012/49002042-d0ce2680-f1a1-11e8-8981-f079df4eb31a.PNG)

<center>자동으로 4.5 버전의 .NET Framework를 선택한다.</center><br />

 하지만 .NET Framework를 다운 받기 위해 https://www.microsoft.com/net/download/visual-studio-sdks 에 접속하면 4.5 버전이 아닌 4.5.2 버전만 존재한다. 프로젝트 파일을 열어 `TargetFrameworkVersion`을 수정할 수 있지만 Unity가 로드될 때 마다 버전을 4.5.2로 수정해야하기 때문에 상당히 귀찮다.

 이를 해결하는 방법은 아주 간단하다. 4.5.2 버전의 .NET Framework를 설치하고 SDK가 설치된 `C:\Program Files (x86)\Reference Assemblies\Microsoft\Framework\.NETFramework`  폴더로 이동한다. 앞서 우리가 설치한 .NET Framework인 v4.5.2 폴더가 존재하는 것을 확인할 수 있는데, SDK 폴더의 이름을 v4.5.2에서 v4.5로 변경해주면 된다. 이후엔 C# 플러그인이 제대로 로드되게 된다.