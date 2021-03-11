원하는 버전의 커널을 사용하기위해 원하는 커널을 다운받아 컴파일하는 방법에 대해 알아보겠습니다.

# 커널 다운로드

먼저 원하는 커널을 다운받아야하는데료 다운받는 방법에는 두가지 방법이 있습니다. 둘 중 편하신 방법으로 커널을 다운받으시면 됩니다.

## 브라우저에서 다운로드

인터넷 브라우저를 통해 www.kernel.org로 접속한 다음, 자신이 원하는 버전의 커널을 다운받습니다. 하이퍼링크들 중 가장 왼쪽의 링크를 클릭하시면 됩니다.

![linux-compile-01](https://user-images.githubusercontent.com/18159012/49138917-d78ca300-f333-11e8-8b5d-ccb8becf3962.png)

## 커널에서 다운로드

커널에서 명령어를 통해 커널을 다운 받는 방법입니다. 커널에서 ""명령어를 입력해 원하는 버전의 커널을 다운로드 받습니다. 명령어로 파일을 받을 때 주의할 점은 명령어를 실행한 위치에 파일이 다운 받아진다는 것입니다. 때문에 명령어를 실행한 폴더의 위치를 정확하게 알고 계셔야합니다. 저는 '다운로드' 폴더에 압축파일을 다운로드했습니다.

![linux-compile-02](https://user-images.githubusercontent.com/18159012/49138934-e1aea180-f333-11e8-9fc4-b2de5daa0908.png)

 이후의 작업은 터미널에서 하도록 하겠습니다. 먼저 `su` 명령어를 입력하여 수퍼유저의 권한을 얻습니다. 이때 비밀번호가 필요한데 페도라를 설치할 때 설정했던 비밀번호를 입력하시면 됩니다.

![linux-compile-03](https://user-images.githubusercontent.com/18159012/49138945-e96e4600-f333-11e8-8a5c-22382bac28bf.png)

'다운로드' 폴더의 위치는 '/home/[계정이름]/[다운로드]' 입니다. 아래와 같이 해당 디렉토리로 이동해 안에 있는 파일을 보면 위에서 다운 받은 파일이 있는 것을 확인할 수 있습니다.

![linux-compile-04](https://user-images.githubusercontent.com/18159012/49138955-ef642700-f333-11e8-8cce-d22f91abac0e.png)

다운받은 파일을 "/usr/src" 위치로 이동시킵니다.

![linux-compile-05](https://user-images.githubusercontent.com/18159012/49138967-f4c17180-f333-11e8-86cd-a8947b1fec4d.png)

현재 다운 받은 파일은 .tar과 .xz 포맷으로 두번 압축이 되어있는 상태입니다. 먼저 .xz 압축을 `xz -z [파일이름]` 명령어를 이용해 풀어줍니다.

![linux-compile-06](https://user-images.githubusercontent.com/18159012/49138984-fd19ac80-f333-11e8-8c86-d8405a8e7ad7.png)

풀려진 .tar 로 압축이 되어있는 파일을 `tar -xvf [파일이름]` 명령어를 이용해 압축 해제해줍니다.

![linux-compile-07](https://user-images.githubusercontent.com/18159012/49138994-0440ba80-f334-11e8-95de-8e001509ab95.png)

![linux-compile-08](https://user-images.githubusercontent.com/18159012/49139016-0efb4f80-f334-11e8-8784-712d5cd4e159.png)

압축해제된 파일을 바로 이용할 수도 있지만 좀 더 편하게 사용하기 위해 'linux'라는 디렉토리에 압축 해제된 디렉토리를 링크하여 사용하도록 하겠습니다. `ln -sf [링크하려는디렉토리] [링크되는디렉토리]` 명령어를 사용합니다.

![linux-compile-09](https://user-images.githubusercontent.com/18159012/49139023-14f13080-f334-11e8-8f73-b36f827ee1cc.png)

`yum install gcc` 명령어로 컴파일에 필요한 gcc 컴파일러를 설치해 줍니다.

![linux-compile-10](https://user-images.githubusercontent.com/18159012/49139032-1ae71180-f334-11e8-922b-ebe4d2088f2c.png)

`make mrproper` 명령어로 이전 커널 설치에 사용 되었던 파일들을 정리해 줍니다.

![linux-compile-11](https://user-images.githubusercontent.com/18159012/49139040-20445c00-f334-11e8-9084-820f1c11efff.png)

`yum install ncurses-devel` 명령어로 menuconfig를 사용하기 위해 사용되는 ncurses를 설치합니다.

![linux-compile-12](https://user-images.githubusercontent.com/18159012/49139051-25a1a680-f334-11e8-8adc-a86b91b205fc.png)

`make menuconfig` 를 입력하여 커널을 컴파일 할 때 사용되는 옵션을 설정합니다.

![linux-compile-13](https://user-images.githubusercontent.com/18159012/49139056-2afef100-f334-11e8-8dad-294e330a0969.png)

![linux-compile-14](https://user-images.githubusercontent.com/18159012/49139065-305c3b80-f334-11e8-93e4-dcd5e018f9e6.png)

`make` 명령어로 Makefile을 이용해 작성된 함수들을 결합하여 컴파일 합니다. Makefile은 이후 시스템 콜을 추가할 때 다시 한 번 다루도록 하겠습니다.

![linux-compile-15](https://user-images.githubusercontent.com/18159012/49139078-35b98600-f334-11e8-9b00-8662c80112e6.png)

`make modules` 명령어로 모듈들을 컴파일 합니다.

![linux-compile-16](https://user-images.githubusercontent.com/18159012/49139086-3a7e3a00-f334-11e8-8380-ea77d4f13882.png)

`make modules_install` 명령어로 컴파일된 모듈들을 커널에 설치합니다. (/lib/modules/ 안에 설치합니다.)

![linux-compile-17](https://user-images.githubusercontent.com/18159012/49139098-3fdb8480-f334-11e8-892f-08cecae9964c.png)

`make install` 명령어를 입력하여 컴파일로 생성한 실행 가능한 파일들을 머신 디렉토리로 이동시킵니다.

![linux-compile-18](https://user-images.githubusercontent.com/18159012/49139103-4538cf00-f334-11e8-80a2-e0f96d671bce.png)

`uname -r` 명령어를 통해 재부팅하여 컴파일된 커널을 확인하기  전에 현재 커널의 버전을 확인하겠습니다.

![linux-compile-19](https://user-images.githubusercontent.com/18159012/49139107-4964ec80-f334-11e8-8d31-ba730eff878a.png)

`reboot` 명령어로 재시작합니다.

![linux-compile-20](https://user-images.githubusercontent.com/18159012/49139119-4ec23700-f334-11e8-82b9-bbff8e32a35c.png)

재부팅 후 컴파일한 커널 버전의 항목으로 이동하여 버전을 확인하면 자신이 컴파일했던 버전의 커널로 컴파일이 된것을 확인할 수 있습니다.

![linux-compile-21](https://user-images.githubusercontent.com/18159012/49139137-5b468f80-f334-11e8-9032-6b626ecdb508.png)