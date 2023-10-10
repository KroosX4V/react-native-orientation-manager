const enum Color
{
    Amber = "#E8B844",
    GoldenYellow = "#F5D97E",
    Pink = "#F03861",
    Beige = "#FEF2F2",
}

const enum AppColor
{
    Primary = Color.Beige,
    PrimaryAdjacent = Color.Pink,
    PrimaryText = "#0D153D",

    Secondary = Color.Amber,
    SecondaryAdjacent = Color.GoldenYellow,

    Tertiary = "#0D153D",
}

enum ComponentColor
{
    Primary = AppColor.Primary,
    PrimaryAdjacent = AppColor.PrimaryAdjacent,
    PrimaryText = AppColor.PrimaryText,
    PrimaryAdjacentText = "white",
    PrimaryAccent1 = AppColor.Secondary,
    PrimaryAccent1Adjacent = AppColor.SecondaryAdjacent,
    PrimaryAccent2 = AppColor.Tertiary,
    PrimaryAccent1Text = "black",
    PrimaryAccent2Text = AppColor.SecondaryAdjacent,

    Secondary = AppColor.Secondary,
    SecondaryAdjacent = AppColor.SecondaryAdjacent,
    SecondaryText = "#FAF2DB",
    SecondaryAdjacentText = "black",
    SecondaryAccent = AppColor.Tertiary,

    Tertiary = AppColor.Tertiary,
    TertiaryText = AppColor.SecondaryAdjacent,
    TertiaryAccent = AppColor.PrimaryAdjacent,
}

export default ComponentColor;