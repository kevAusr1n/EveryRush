using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EveryRush.Migrations
{
    /// <inheritdoc />
    public partial class AddTableToOneDatabase1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SnapshotIds",
                table: "Orders");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SnapshotIds",
                table: "Orders",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
