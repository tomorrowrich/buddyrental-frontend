export interface CreateReservationDto {
  readonly buddyId: string;

  readonly price: number;

  readonly detail: string;

  readonly reservationStart: string;

  readonly reservationEnd: string;
}
