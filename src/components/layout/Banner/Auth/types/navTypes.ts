export type NavItem =
  | {
      to: string;
      label: string;
      authOnly?: undefined;
    }
  | {
      to: string;
      label: string;
      authOnly: boolean;
    };
