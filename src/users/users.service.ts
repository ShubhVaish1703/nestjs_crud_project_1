import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
    private users = [
        {
            "id": 1,
            "name": "Alice Johnson",
            "email": "alice.johnson@example.com",
            "role": "admin"
        },
        {
            "id": 2,
            "name": "Bob Smith",
            "email": "bob.smith@example.com",
            "role": "editor"
        },
        {
            "id": 3,
            "name": "Carol Williams",
            "email": "carol.williams@example.com",
            "role": "admin"
        },
        {
            "id": 4,
            "name": "David Brownie",
            "email": "david.brown@example.com",
            "role": "viewer"
        },
        {
            "id": 5,
            "name": "Eve Davis",
            "email": "eve.davis@example.com",
            "role": "admin"
        }
    ]

    findAll({
        role,
    }: {
        role?: string,
    }) {
        if (role) {
            const filteredUsers = this.users.filter(user => user.role === role)
            if(!filteredUsers?.length){
                throw new NotFoundException('No Data not found with this role!')
            }
            return filteredUsers;
        }
        return this.users;
    }

    findOne({ id }: { id: number }) {
        const user = this.users.find(user => user.id === id);
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user;
    }

    create(
        createUserDto: CreateUserDto
    ) {
        const usersByHighestId = [...this.users].sort((a, b) => b.id - a.id);
        const newUser = {
            id: usersByHighestId[0].id + 1,
            ...createUserDto
        };

        this.users.push(newUser);
        return newUser;
    }
    update(
        id: number,
        updateUserDto: UpdateUserDto
    ) {
        this.users = this.users.map(user => {
            if (user.id === id) {
                return { ...user, ...updateUserDto }
            }
            return user;
        })

        return this.findOne({ id });
    }

    delete(id: number) {
        const removedUser = this.findOne({ id });
        this.users = this.users.filter(user => user.id !== removedUser.id);

        return removedUser;
    }
}
