namespace API.DTOs;

public class UserDto
{
    public required String Username { get; set; }
    public required String KnownAs { get; set; }
    public required String Token { get; set; }
    public required string Gender { get; set; }
    public String? PhotoUrl { get; set; }
}
