import { Pageable } from "../../core/model/page/Pageable";

export interface PrestamoSearchDto{
    gameId?: number | null;
    customerId?: number | null;
    date?: string | null;
    pageable: Pageable;
}