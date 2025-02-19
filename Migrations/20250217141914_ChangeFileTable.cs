using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EveryRush.Migrations
{
    /// <inheritdoc />
    public partial class ChangeFileTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Content",
                table: "AppFiles");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "AppFiles",
                newName: "Url");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Url",
                table: "AppFiles",
                newName: "Name");

            migrationBuilder.AddColumn<byte[]>(
                name: "Content",
                table: "AppFiles",
                type: "longblob",
                nullable: true);
        }
    }
}
