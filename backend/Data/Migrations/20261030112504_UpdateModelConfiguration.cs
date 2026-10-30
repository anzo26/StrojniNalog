using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StrojniNalog.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModelConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_DelovniNalogi_DejanskiTermin",
                table: "DelovniNalogi",
                sql: "\"DejanskiKonec\" IS NULL OR (\"DejanskiZacetek\" IS NOT NULL AND \"DejanskiKonec\" >= \"DejanskiZacetek\")");

            migrationBuilder.AddCheckConstraint(
                name: "CK_DelovniNalogi_OpravljeneUre",
                table: "DelovniNalogi",
                sql: "\"OpravljeneUre\" IS NULL OR \"OpravljeneUre\" > 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_DelovniNalogi_PredvideniTermin",
                table: "DelovniNalogi",
                sql: "\"PredvideniKonec\" > \"PredvideniZacetek\"");

            migrationBuilder.AddCheckConstraint(
                name: "CK_DelovniNalogi_Status",
                table: "DelovniNalogi",
                sql: "\"Status\" IN ('NACRTOVAN', 'V_IZVAJANJU', 'CAKA_NA_PREGLED', 'ZAKLJUCEN', 'V_DOPOLNITVI')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_DelovniNalogi_DejanskiTermin",
                table: "DelovniNalogi");

            migrationBuilder.DropCheckConstraint(
                name: "CK_DelovniNalogi_OpravljeneUre",
                table: "DelovniNalogi");

            migrationBuilder.DropCheckConstraint(
                name: "CK_DelovniNalogi_PredvideniTermin",
                table: "DelovniNalogi");

            migrationBuilder.DropCheckConstraint(
                name: "CK_DelovniNalogi_Status",
                table: "DelovniNalogi");
        }
    }
}
