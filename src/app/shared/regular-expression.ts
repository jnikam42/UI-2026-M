export class RegularExpression {

    static readonly ROLE_NAME = '^[^0-9][A-Za-z0-9\s]{3,50}$';
    static readonly NICK = '^[a-zA-Z0-9]+$';
    static readonly USER_NAME = '^(M\/s |M\/S )?[A-Za-z\s]{3,50}$';
    static readonly EMAIL = '^(?=.{1,100}$)(?!.*\.\.)[a-zA-Z0-9._$-]{3,}@[a-zA-Z0-9.]+\.(com|in|co|org|uk|us|net)$';
    static readonly STRONG_PASSWORD = '^(?=(.*[A-Z]))(?=(.*[a-z]))(?=(.*[0-9]))(?=(.*[!@#$%^&*(),.?":{}|<>])).{8,}$';
    static readonly MOBILE_NO = '^[5-9][0-9]{9}$';
    static readonly ACCOUNT_NO = '\\d+';
    static readonly VPA = '^.+@.+';
    static readonly RRN = '^[0-9]{12}$';
    static readonly TRANSACTION_ID = '^[a-zA-Z0-9]{35}$';
    static readonly BLOCKVALUE = '^[a-zA-Z0-9@.]*$';
    static readonly REASON = '^[a-zA-Z0-9._ ]*$';
}
