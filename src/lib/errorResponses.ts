export type TooManyRequestsErrorBody = {
  error: string;
  cooldown: {
    minutes: number;
    seconds: number;
  };
};
