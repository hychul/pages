안드로이드에서 가장 쉽게 외부 라이브러리 모듈을 가져와 사용하는 방법은 'Import Module...' 버튼을 사용하는 것입니다.

![android-extern-module-01](https://user-images.githubusercontent.com/18159012/49137538-16205e80-f330-11e8-9ef5-7e55f2bfffd4.png)

이 방법으론 사용하려는 모듈 프로젝트가 현재 프로젝트 폴더 안으로 복사되어 사용하게 되므로, 만약 참조하려는 모듈 프로젝트에서 변경사항이 생기더라도 이를 반영하지 못하게 됩니다. 사용하려는 모듈 프로젝트에서 변경사항이 생기더라도 이를 현재 프로젝트에 반영할 수 잇도록 하기 위해선 모듈을 복사가 아닌 참조가 필요합니다.

# 모듈의 참조

1. 프로젝트에서 'Gradle Scripts - settings.gradle (Project Settings)' 파일을 열어 내용을 수정합니다.

   ![android-extern-module-02](https://user-images.githubusercontent.com/18159012/49137618-5253bf00-f330-11e8-898b-fae40e166d62.png)

2. 기존에 있던 내용에 아래와 같이 내용을 추가합니다.

![android-extern-module-03](https://user-images.githubusercontent.com/18159012/49137637-68617f80-f330-11e8-9f5f-558e43261a48.png)

<center>수정 전</center>

![android-extern-module-04](https://user-images.githubusercontent.com/18159012/49137675-7c0ce600-f330-11e8-9072-8e11967e4181.png)

<center>수정 후</center>

3. 프로젝트에서 'Gradle Scripts - build.gradle (Module: app)' 파일을 열어 내용을 수정합니다.

![android-extern-module-05](https://user-images.githubusercontent.com/18159012/49137697-9050e300-f330-11e8-9f96-865a1d5bbf8b.png)

4. 기존 내용에 새로 참조하려는 모듈을 추가합니다.

![android-extern-module-06](https://user-images.githubusercontent.com/18159012/49137718-9ba40e80-f330-11e8-90d7-a9f3ed19e642.png)

<center>수정 전</center>

![android-extern-module-07](https://user-images.githubusercontent.com/18159012/49137741-ac548480-f330-11e8-9caa-0ac336139b8a.png)

<center>수정 후</center>

이렇게 하면 참조한 모듈이 프로젝트에 적용됩니다.




