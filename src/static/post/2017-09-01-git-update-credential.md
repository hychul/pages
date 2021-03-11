```
~/ProjectName (master)
remote: Invalid username or passwrod.
fatal: AUthentication failed for 'https://github.com/ProjectName'
```

 터미널에서 Git을 사용하다가 다른 계정으로 로그인을 해야되거나, 비밀번호를 바꿔서 로컬 터미널에서 인증실패로 위와 같은 메시지를 보았을 땐 계정을 재설정해야합니다. 이때 credential helper를 초기화하는 명령어를 통해 계정을 재설정할 수 있습니다.

```terminal
git config --unset credential.helper
```

