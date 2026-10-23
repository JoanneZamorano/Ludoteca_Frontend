import { Customer } from "../../customer/model/customer";
import { Game } from "../../game/model/Game";

export interface Prestamo {
    id: number;
    game: Game;
    customer: Customer;
    startDate: string;
    endDate: string;
}