export const BallType = {
    Normal: "normal",
    Golden: "golden"
} as const;

export type BallType =
    (typeof BallType)[keyof typeof BallType];
