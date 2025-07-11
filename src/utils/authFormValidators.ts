
export function validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const result =regex.test(email)
    if(!result){
      return "Enter valid email format!"
    }
    return ""
  }
  
  export function validatePassword(password: string){
    if(password.trim()){
      if(password.length<6){
        return "Password must be atleast 6 chars"
      }
    }
    return ""
  }