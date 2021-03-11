실시간 키보드 입력이란 C언어를 배울때 기본적으로 배우는 scanf() 함수와 같이, 개행을 입력할때 까지 기다렸다가 다음 코드로 넘어가지 않고, 사용자가 키를 입력할 때 마다 char 단위로 입력값을 받아오는 코드입니다.

# 문자단위 키보드 입력 구현

```c
#include <stdio.h>
#include <cornio.h>

char getKey();

int main(void)
{
    char key;
    while(1) 
    {
        key = getch(); // 입력값을 읽을때 까지 대기했다가 읽으면 다음 문장 실행
        printf("%c", key); // 입력값을 화면에 출력
    }
    return 0;
}
```

 getch() 함수를 이용해 입력값을 읽어와 printf() 함수를 이용해 화면에 출력합니다. getch() 함수는 키보드로 키를 입력하기 전까지 대기를 하다가 키를 누른 뒤에 다음 문장으로 진행하기 때문에 실시간으로 키를 입력하는 것이라고 보기 힘듬니다. 실시간 입력을 위해선 입력값이 없을 경우 입력을 무시하고 다음 문장으로 진행하도록 수정해야합니다. kbhit() 함수를 이용해 이를 구현할 수 있습니다. kbhit() 함수는 입력 버퍼에 입력값이 있는지 확인(peek)하여 만약에 입력값이 있다면 true를, 없다면 false를 리턴해 줍니다.

# 실시간 키보드 입력 구현

```c
#include <stdio.h>
#include <cornio.h>

char getKey();

int main(void)
{
    char key;
    while(1) 
    {
        key = getKey();
        if(key != '\0') // 입력값을 읽었다면 읽은 값을 출력
            printf("%c", key);
    }
    return 0;
}

char getKey()
{
    if(kbhit()) // kbhit()이용해 입력값이 있는지 확인 
    {
        return getch();     // 입력값이 getch()로 char를 리턴해줌
    }
    return '\0'; // 입력값이 없으면 널 문자 리턴
}
```

 kbhit()을 이용해 입력 버퍼를 확인(peek)하여 입력값이 존재할 경우 getch()를 이용해 받아온 입력값을 리턴해줍니다. 이렇게 구현하여 입력값이 없을 때에도 입력 구문에서 대기를 하지 않고 건너뛰어 프로그램이 연속적으로 진행하는 것처럼 구현할 수 있습니다.