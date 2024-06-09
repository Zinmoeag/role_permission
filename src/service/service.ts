export default abstract class Service {
    abstract _exclude : string[]

    // exclude<User, Key extends keyof User> (
    //     user: User & Record<string, any>,
    //     keys: Key[]
    //     ): Omit<User, Key> {
    //     const filteredEntries = Object.entries(user).filter(
    //         ([key]) => !keys.includes(key as Key)
    //     );
        
    //     return Object.fromEntries(filteredEntries) as unknown as Omit<User, Key>;
    // }

    exclude(data : Object){
        const filteredEntries = Object.entries(data).filter(
            ([key]) => !this._exclude.includes(key)
        )

        return Object.fromEntries(filteredEntries)
    }
}