
export interface UserType {
    user_id: string,
    username: string,
    email: string,
    password: string,
    isAdmin:Boolean,
    file:any
};

export interface ContextType{
    token:string
};

export interface ProductType{
    product_id:string,
    product_name:string,
    price:number,
    measurement:string,
    quantity:number,
    category_id:string,
    file:any
};



export interface CommentType{
    comment_id:string,
    title:string,
    product_id:string
};

export interface CategoryType{
    category_id:string,
    category_name:string
};


export interface BuyType{
    buy_id:string,
    user_id:string,
    product_id:string
}