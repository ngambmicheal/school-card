export function getFloat(num:any){
    return parseFloat(parseFloat(num).toFixed(2))
}

export function generateRandomString(length: number):string{
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

export   function padWithLeadingZeros(num:number, totalLength:number) {
        return String(num).padStart(totalLength, '0');
      }