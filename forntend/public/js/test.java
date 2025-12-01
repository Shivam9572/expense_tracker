public class test{
   static int reverse(int num){
     boolean p=true;
     if(num<0){
        p=false;
     }
     int result=0;
      while(num>0){
         int ld=num%10;
        result=(result*10)+ld;
        num=num/10;
      }
      if(p){
        return result;
      }
      return  (-1)*result;
   }

   public static void main(String[] args){
     System.out.println(reverse(-123));
   }

}
